use axum::{
    extract::State,
    http::StatusCode,
    response::Json,
    routing::post,
    Router,
};
use sqlx::PgPool;
use validator::Validate;

use crate::{
    auth::service::AuthService,
    models::{CreateUserRequest, User, AuthResponse},
};


#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
    pub auth_service: AuthService,
}

pub fn auth_routes() -> Router<AppState> {
    Router::new()
        .route("/register", post(register))
        .route("/login", post(login))
}

async fn register(
    State(state): State<AppState>,
    Json(payload): Json<CreateUserRequest>,
) -> Result<Json<AuthResponse>, (StatusCode, String)> {

    if let Err(validation_errors) = payload.validate() {
        return Err((StatusCode::BAD_REQUEST, format!("Validation failed: {:?}", validation_errors)));
    }


    let existing_user: Option<User> = sqlx::query_as("SELECT * FROM users WHERE email = $1")
        .bind(&payload.email)
        .fetch_optional(&state.pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    if existing_user.is_some() {
        return Err((StatusCode::CONFLICT, "User already exists".to_string()));
    }


    let password_hash = state.auth_service
        .hash_password(&payload.password)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let mut tx = state.pool.begin().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;


    let user: User = sqlx::query_as(
        "INSERT INTO users (email, full_name, verification_tier)
         VALUES ($1, $2, $3)
         RETURNING *"
    )
        .bind(&payload.email)
        .bind(&payload.full_name)
        .bind("standard")
        .fetch_one(&mut *tx)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    sqlx::query(
        "INSERT INTO auth_methods (user_id, provider, provider_user_id, password_hash)
         VALUES ($1, $2, $3, $4)"
    )
        .bind(&user.id)
        .bind("email")
        .bind(&user.email)
        .bind(&password_hash)
        .execute(&mut *tx)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;


    tx.commit().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    // JWT token
    let token = state.auth_service
        .generate_token(user.id, &user.email)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(AuthResponse { token, user }))
}

async fn login() -> Result<Json<AuthResponse>, (StatusCode, String)> {
    Err((StatusCode::NOT_IMPLEMENTED, "Login not implemented yet".to_string()))
}