mod models;

use sqlx::postgres::PgPoolOptions;
use models::{User, NewUser};

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

    // Test database connection
    if let Err(e) = test_db_connection().await {
        eprintln!("❌ Database connection failed: {}", e);
        return;
    }

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

//  Database test function
async fn test_db_connection() -> Result<(), sqlx::Error> {
    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;

    // Test by counting users (should be 0 initially)
    let result: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM users")
        .fetch_one(&pool)
        .await?;

    println!("✅ Database connection successful!");
    println!("✅ Users in database: {}", result.0);

    // Test if we can query user structure
    let users: Vec<User> = sqlx::query_as("SELECT * FROM users LIMIT 5")
        .fetch_all(&pool)
        .await?;

    println!("✅ User model works! Found {} users", users.len());

    Ok(())
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
