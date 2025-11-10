use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct UserProfile {
    pub id: i32,
    pub user_id: i32,
    pub headline: Option<String>,
    pub summary: Option<String>,
    pub location: Option<String>,
    pub website: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateProfileRequest {
    pub headline: Option<String>,
    pub summary: Option<String>,
    pub location: Option<String>,
    pub website: Option<String>,
}
