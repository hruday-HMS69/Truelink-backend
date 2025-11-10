mod models;
mod routes;
mod auth;

use routes::{create_routes, AppState};
use auth::service::AuthService;
use sqlx::postgres::PgPoolOptions;
use std::env;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");

    let jwt_secret = env::var("JWT_SECRET")
        .expect("JWT_SECRET must be set");

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to create pool");

    println!("✅ Database connection successful!");

    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    match sqlx::query!("SELECT COUNT(*) as count FROM users")
        .fetch_one(&pool)
        .await
    {
        Ok(row) => println!("✅ Users in database: {}", row.count.unwrap_or(0)),
        Err(e) => println!("⚠️  Could not count users: {}", e),
    }

    let auth_service = AuthService::new(jwt_secret);

    let app_state = AppState {
        pool,
        auth_service,
    };

    let app = create_routes(app_state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await?;
    println!("🚀 Server running at http://127.0.0.1:8080");

    axum::serve(listener, app).await?;

    Ok(())
}