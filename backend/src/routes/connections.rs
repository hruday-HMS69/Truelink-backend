use axum::{
    extract::{State, Path, Query},
    http::{StatusCode, HeaderMap},
    response::IntoResponse,
    Json,
};
use serde::Deserialize;
use uuid::Uuid;

use crate::routes::AppState;
use crate::models::{ConnectionRequest, UpdateConnectionRequest};
use crate::auth::middleware::{get_user_id_from_headers, Claims};

#[derive(Debug, Deserialize)]
pub struct SearchQuery {
    pub q: Option<String>,
}

pub async fn search_users(
    State(state): State<AppState>,
    Query(query): Query<SearchQuery>,
) -> impl IntoResponse {
    let search_term = query.q.unwrap_or_default();

    if search_term.is_empty() {
        return (StatusCode::BAD_REQUEST, Json(serde_json::json!({
            "error": "Search query is required"
        })));
    }

    let users = match sqlx::query!(
        r#"
        SELECT id, email, full_name, profile_picture_url
        FROM users
        WHERE full_name ILIKE $1 OR email ILIKE $1
        ORDER BY full_name
        LIMIT 10
        "#,
        format!("%{}%", search_term)
    )
        .fetch_all(&state.pool)
        .await {
        Ok(users) => users,
        Err(e) => {
            eprintln!("Database search error: {}", e);
            return (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({
                "error": "Failed to search users"
            })));
        }
    };

    let user_results: Vec<serde_json::Value> = users.into_iter().map(|user| {
        serde_json::json!({
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "profile_picture_url": user.profile_picture_url,
            "headline": "Professional"
        })
    }).collect();

    (StatusCode::OK, Json(serde_json::json!({
        "users": user_results,
        "count": user_results.len()
    })))
}

pub async fn send_connection_request(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(payload): Json<ConnectionRequest>,
) -> impl IntoResponse {
    let current_user_id = match get_user_id_from_headers(&headers) {
        Some(user_id) => user_id,
        None => {
            return (StatusCode::UNAUTHORIZED, Json(serde_json::json!({
                "error": "Authentication required"
            })));
        }
    };

    println!("User {} wants to connect with {}", current_user_id, payload.receiver_id);

    if current_user_id == payload.receiver_id {
        return (StatusCode::BAD_REQUEST, Json(serde_json::json!({
            "error": "Cannot connect to yourself"
        })));
    }

    let _receiver_exists = match sqlx::query!(
        "SELECT id FROM users WHERE id = $1",
        payload.receiver_id
    )
        .fetch_optional(&state.pool)
        .await {
        Ok(Some(_)) => true,
        Ok(None) => {
            return (StatusCode::NOT_FOUND, Json(serde_json::json!({
                "error": "User not found"
            })));
        },
        Err(e) => {
            eprintln!("Database error checking user: {}", e);
            return (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({
                "error": "Database error"
            })));
        }
    };

    match sqlx::query!(
        r#"
        INSERT INTO connections (sender_id, receiver_id, status)
        VALUES ($1, $2, 'pending')
        ON CONFLICT (sender_id, receiver_id) DO NOTHING
        RETURNING id
        "#,
        current_user_id,
        payload.receiver_id
    )
        .fetch_optional(&state.pool)
        .await {
        Ok(Some(connection)) => {
            println!("✅ Connection request created: {}", connection.id);
            (StatusCode::OK, Json(serde_json::json!({
                "message": "Connection request sent",
                "connection_id": connection.id,
                "status": "pending"
            })))
        },
        Ok(None) => {
            (StatusCode::CONFLICT, Json(serde_json::json!({
                "error": "Connection request already exists"
            })))
        },
        Err(e) => {
            eprintln!("Database insert error: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({
                "error": format!("Failed to send connection request: {}", e)
            })))
        }
    }
}

pub async fn get_pending_requests(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> impl IntoResponse {
    let current_user_id = match get_user_id_from_headers(&headers) {
        Some(user_id) => user_id,
        None => {
            return (StatusCode::UNAUTHORIZED, Json(serde_json::json!({
                "error": "Authentication required"
            })));
        }
    };

    let requests = match sqlx::query!(
        r#"
        SELECT c.id, c.sender_id, u.full_name as sender_name, u.email as sender_email, c.created_at
        FROM connections c
        JOIN users u ON c.sender_id = u.id
        WHERE c.receiver_id = $1 AND c.status = 'pending'
        ORDER BY c.created_at DESC
        "#,
        current_user_id
    )
        .fetch_all(&state.pool)
        .await {
        Ok(requests) => requests,
        Err(e) => {
            eprintln!("Database error: {}", e);
            return (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({
                "error": "Failed to fetch connection requests"
            })));
        }
    };

    let request_results: Vec<serde_json::Value> = requests.into_iter().map(|req| {
        serde_json::json!({
            "id": req.id,
            "sender_id": req.sender_id,
            "sender_name": req.sender_name,
            "sender_email": req.sender_email,
            "created_at": req.created_at
        })
    }).collect();

    (StatusCode::OK, Json(serde_json::json!({
        "requests": request_results
    })))
}

pub async fn update_connection_request(
    State(state): State<AppState>,
    headers: HeaderMap,
    Path(connection_id): Path<Uuid>,
    Json(payload): Json<UpdateConnectionRequest>,
) -> impl IntoResponse {
    let current_user_id = match get_user_id_from_headers(&headers) {
        Some(user_id) => user_id,
        None => {
            return (StatusCode::UNAUTHORIZED, Json(serde_json::json!({
                "error": "Authentication required"
            })));
        }
    };

    println!("User {} updating connection {} to status: {:?}", current_user_id, connection_id, payload.status);

    match sqlx::query!(
        r#"
        UPDATE connections
        SET status = $1, updated_at = NOW()
        WHERE id = $2 AND receiver_id = $3
        RETURNING id
        "#,
        payload.status.to_string(),
        connection_id,
        current_user_id
    )
        .fetch_optional(&state.pool)
        .await {
        Ok(Some(_)) => {
            (StatusCode::OK, Json(serde_json::json!({
                "message": format!("Connection request {}", payload.status),
                "connection_id": connection_id,
                "status": payload.status
            })))
        },
        Ok(None) => {
            (StatusCode::NOT_FOUND, Json(serde_json::json!({
                "error": "Connection request not found or you don't have permission"
            })))
        },
        Err(e) => {
            eprintln!("Database error: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({
                "error": "Failed to update connection request"
            })))
        }
    }
}

pub async fn get_connections(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> impl IntoResponse {
    let current_user_id = match get_user_id_from_headers(&headers) {
        Some(user_id) => user_id,
        None => {
            return (StatusCode::UNAUTHORIZED, Json(serde_json::json!({
                "error": "Authentication required"
            })));
        }
    };

    let connections = match sqlx::query!(
        r#"
        SELECT
            c.id as connection_id,
            u.id as user_id,
            u.full_name,
            u.email,
            u.profile_picture_url,
            c.created_at as connected_at
        FROM connections c
        JOIN users u ON (
            (c.sender_id = $1 AND c.receiver_id = u.id) OR
            (c.receiver_id = $1 AND c.sender_id = u.id)
        )
        WHERE c.status = 'accepted'
        ORDER BY c.created_at DESC
        "#,
        current_user_id
    )
        .fetch_all(&state.pool)
        .await {
        Ok(connections) => connections,
        Err(e) => {
            eprintln!("Database error: {}", e);
            return (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({
                "error": "Failed to fetch connections"
            })));
        }
    };

    let connection_results: Vec<serde_json::Value> = connections.into_iter().map(|conn| {
        serde_json::json!({
            "id": conn.connection_id,
            "user_id": conn.user_id,
            "full_name": conn.full_name,
            "email": conn.email,
            "profile_picture_url": conn.profile_picture_url,
            "connected_at": conn.connected_at
        })
    }).collect();

    (StatusCode::OK, Json(serde_json::json!({
        "connections": connection_results,
        "count": connection_results.len()
    })))
}
