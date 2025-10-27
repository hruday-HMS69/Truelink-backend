mod models;
mod routes;
mod auth;

use axum::{
    routing::get,
    Router,
    response::Json,
};
use serde_json::{json, Value};
use std::net::SocketAddr;
use sqlx::postgres::PgPoolOptions;
use dotenvy::dotenv;
use tracing_subscriber;

use routes::auth_routes;
use auth::service::AuthService;

#[tokio::main]
async fn main() {
    
    tracing_subscriber::fmt::init();
    dotenv().ok();

    
    let port: u16 = std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse()
        .expect("PORT must be a valid number");

    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");

    let jwt_secret = std::env::var("JWT_SECRET")
        .expect("JWT_SECRET must be set");

    
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to create pool");

    
    let result: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM users")
        .fetch_one(&pool)
        .await
        .expect("Failed to connect to database");

    println!("✅ Database connection successful!");
    println!("✅ Users in database: {}", result.0);

    
    let auth_service = AuthService::new(jwt_secret);

    
    let app_state = routes::auth::AppState {
        pool,
        auth_service,
    };

    
    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health_check))
        .route("/api/status", get(api_status))
        .nest("/api/auth", auth_routes())
        .with_state(app_state);

    
    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    tracing::info!("🚀 Server running at http://{}", addr);

    axum::serve(
        tokio::net::TcpListener::bind(addr).await.unwrap(),
        app,
    )
        .await
        .unwrap();
}


async fn root() -> Json<Value> {
    Json(json!({
        "message": "Welcome to TrueLink API 🚀",
        "version": "1.0.0",
        "status": "running"
    }))
}

async fn health_check() -> Json<Value> {
    Json(json!({
        "status": "healthy",
        "timestamp": chrono::Utc::now().to_rfc3339()
    }))
}

async fn api_status() -> Json<Value> {
    let environment = std::env::var("ENVIRONMENT")
        .unwrap_or_else(|_| "development".to_string());

    Json(json!({
        "service": "truelink-backend",
        "status": "operational",
        "environment": environment
    }))
}
