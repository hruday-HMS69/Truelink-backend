pub mod auth;
pub mod profile;
pub mod connections;

use axum::{
    routing::{get, post, put},
    Router,
};
use sqlx::PgPool;
use crate::auth::service::AuthService;
use crate::auth::middleware::auth_middleware;

#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
    pub auth_service: AuthService,
}

pub fn create_routes(state: AppState) -> Router {
    Router::new()
        .route("/", get(root))
        .route("/health", get(health_check))
        .route("/api/status", get(api_status))
        .nest("/api/auth", auth_routes())
        .nest("/api/profile", profile_routes())
        .nest("/api/connections", connection_routes())
        .with_state(state)
        .layer(axum::middleware::from_fn(auth_middleware))
        .layer(
            tower_http::cors::CorsLayer::new()
                .allow_origin(tower_http::cors::Any)
                .allow_methods(tower_http::cors::Any)
                .allow_headers(tower_http::cors::Any)
        )
}

async fn root() -> &'static str {
    "TrueLink API"
}

async fn health_check() -> impl axum::response::IntoResponse {
    axum::Json(serde_json::json!({"status": "healthy"}))
}

async fn api_status() -> impl axum::response::IntoResponse {
    axum::Json(serde_json::json!({
        "status": "ok",
        "service": "TrueLink API",
        "version": "1.0.0"
    }))
}

fn auth_routes() -> Router<AppState> {
    Router::new()
        .route("/register", post(auth::register))
        .route("/login", post(auth::login))
}

fn profile_routes() -> Router<AppState> {
    Router::new()
        .route("/me", get(profile::get_user_profile))
        .route("/me", put(profile::update_user_profile))
}

fn connection_routes() -> Router<AppState> {
    Router::new()
        .route("/search", get(connections::search_users))
        .route("/request", post(connections::send_connection_request))
        .route("/requests", get(connections::get_pending_requests))
        .route("/requests/:id", put(connections::update_connection_request))
        .route("/", get(connections::get_connections))
}