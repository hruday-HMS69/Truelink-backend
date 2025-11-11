use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Connection {
    pub id: Uuid,
    pub sender_id: Uuid,
    pub receiver_id: Uuid,
    pub status: ConnectionStatus,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "varchar")]
pub enum ConnectionStatus {
    Pending,
    Accepted,
    Rejected,
}

impl std::fmt::Display for ConnectionStatus {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            ConnectionStatus::Pending => write!(f, "pending"),
            ConnectionStatus::Accepted => write!(f, "accepted"),
            ConnectionStatus::Rejected => write!(f, "rejected"),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ConnectionRequest {
    pub receiver_id: Uuid,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateConnectionRequest {
    pub status: ConnectionStatus,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct ConnectionWithUser {
    pub connection_id: Uuid,
    pub user_id: Uuid,
    pub email: String,
    pub full_name: String,
    pub profile_picture_url: Option<String>,
    pub status: ConnectionStatus,
    pub created_at: chrono::DateTime<chrono::Utc>,
}