use axum::{
    routing::get,
    Router,
    response::Json,
};
use serde_json::{json, Value};
use std::net::SocketAddr;

#[tokio::main]
async fn main() {
    // Initialize logging
    tracing_subscriber::fmt::init();

    // Load environment variables
    dotenvy::dotenv().ok();

    // Log startup info
    let port: u16 = std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse()
        .expect("PORT must be a valid number");

    let db_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "not-set".to_string());

    tracing::info!("Starting TrueLink backend on port {}", port);
    tracing::debug!("Database URL: {}", db_url);

    // Build application with routes
    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health_check))
        .route("/api/status", get(api_status));

    // Start server
    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    tracing::info!("🚀 Server running at http://{}", addr);

    axum::serve(
        tokio::net::TcpListener::bind(addr).await.unwrap(),
        app,
    )
        .await
        .unwrap();
}

// Route handlers
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