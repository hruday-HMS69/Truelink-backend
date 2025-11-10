use axum::{
    extract::{State, Json},
    http::StatusCode,
    response::IntoResponse,
};
use crate::routes::AppState;
use crate::models::{UserProfile, UpdateProfileRequest};

pub async fn get_user_profile(
    State(_state): State<AppState>,
) -> impl IntoResponse {
    let profile = UserProfile {
        id: 1,
        user_id: 1,
        headline: Some("Software Engineer".to_string()),
        summary: Some("Passionate about building great products.".to_string()),
        location: Some("San Francisco, CA".to_string()),
        website: Some("https://example.com".to_string()),
        created_at: chrono::Utc::now(),
        updated_at: chrono::Utc::now(),
    };

    (StatusCode::OK, Json(profile))
}

pub async fn update_user_profile(
    State(_state): State<AppState>,
    Json(profile_data): Json<UpdateProfileRequest>,
) -> impl IntoResponse {
    println!("Updating profile with: {:?}", profile_data);

    let response = serde_json::json!({
        "message": "Profile updated successfully",
        "profile": profile_data
    });

    (StatusCode::OK, Json(response))
}