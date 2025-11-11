use axum::{
    extract::{State, Path, Query},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::Deserialize;
use uuid::Uuid;

use crate::routes::AppState;
use crate::models::{ConnectionRequest, UpdateConnectionRequest, ConnectionWithUser, ConnectionStatus};

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

    
    let mock_users = vec![
        serde_json::json!({
            "id": "11111111-1111-1111-1111-111111111111",
            "email": "alice@example.com",
            "full_name": "Alice Johnson",
            "headline": "Software Engineer at Tech Corp"
        }),
        serde_json::json!({
            "id": "22222222-2222-2222-2222-222222222222", 
            "email": "bob@example.com",
            "full_name": "Bob Smith",
            "headline": "Product Manager at Startup Inc"
        })
    ];

    (StatusCode::OK, Json(serde_json::json!({
        "users": mock_users,
        "count": mock_users.len()
    })))
}


pub async fn send_connection_request(
    State(state): State<AppState>,
    Json(payload): Json<ConnectionRequest>,
) -> impl IntoResponse {
    
    let current_user_id = Uuid::parse_str("11111111-1111-1111-1111-111111111111").unwrap();
    
    println!("User {} wants to connect with {}", current_user_id, payload.receiver_id);
    
    
    (StatusCode::OK, Json(serde_json::json!({
        "message": "Connection request sent",
        "connection": {
            "sender_id": current_user_id,
            "receiver_id": payload.receiver_id,
            "status": "pending"
        }
    })))
}


pub async fn get_pending_requests(
    State(state): State<AppState>,
) -> impl IntoResponse {
    
    let current_user_id = Uuid::parse_str("11111111-1111-1111-1111-111111111111").unwrap();
    
    
    let mock_requests = vec![
        serde_json::json!({
            "id": "33333333-3333-3333-3333-333333333333",
            "sender_id": "44444444-4444-4444-4444-444444444444",
            "sender_name": "Charlie Brown",
            "sender_headline": "Senior Developer",
            "created_at": "2024-01-15T10:30:00Z"
        })
    ];

    (StatusCode::OK, Json(serde_json::json!({
        "requests": mock_requests
    })))
}


pub async fn update_connection_request(
    State(state): State<AppState>,
    Path(connection_id): Path<Uuid>,
    Json(payload): Json<UpdateConnectionRequest>,
) -> impl IntoResponse {
    println!("Updating connection {} to status: {:?}", connection_id, payload.status);
    
    
    
    (StatusCode::OK, Json(serde_json::json!({
        "message": format!("Connection request {}", payload.status),
        "connection_id": connection_id,
        "status": payload.status
    })))
}


pub async fn get_connections(
    State(state): State<AppState>,
) -> impl IntoResponse {
   
    let current_user_id = Uuid::parse_str("11111111-1111-1111-1111-111111111111").unwrap();
    
        let mock_connections = vec![
        serde_json::json!({
            "id": "55555555-5555-5555-5555-555555555555",
            "user_id": "66666666-6666-6666-6666-666666666666",
            "full_name": "Diana Prince",
            "headline": "Engineering Manager",
            "connected_at": "2024-01-10T14:20:00Z"
        })
    ];

    (StatusCode::OK, Json(serde_json::json!({
        "connections": mock_connections,
        "count": mock_connections.len()
    })))
}