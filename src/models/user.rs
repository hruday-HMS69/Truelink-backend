use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    pub full_name: String,
    pub profile_picture_url: Option<String>,
    pub email_verified: bool,
    pub verification_tier: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewUser {
    pub email: String,
    pub full_name: String,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct CreateUserRequest {
    #[validate(email(message = "Invalid email address"))]
    pub email: String,

    #[validate(length(min = 2, message = "Name must be at least 2 characters"))]
    pub full_name: String,

    #[validate(length(min = 8, message = "Password must be at least 8 characters"))]
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: User,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthMethod {
    pub id: Uuid,
    pub user_id: Uuid,
    pub provider: String,
    pub provider_user_id: Option<String>,
    pub password_hash: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
}