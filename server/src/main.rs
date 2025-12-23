mod bpe;

use axum::{
    extract::Json,
    http::Method,
    response::Json as ResponseJson,
    routing::post,
    Router,
};
use bpe::{MergeStep, Token};
use serde::Deserialize;
use tower_http::cors::{CorsLayer, Any};

#[derive(Deserialize)]
struct AnalyzeRequest {
    text: String,
    vocab_size: Option<usize>,
}

#[derive(serde::Serialize)]
struct AnalyzeResponse {
    final_tokens: Vec<Token>,
    merge_history: Vec<MergeStep>,
    vocabulary: Vec<(String, usize)>,
}

async fn analyze(Json(payload): Json<AnalyzeRequest>) -> ResponseJson<AnalyzeResponse> {
    let vocab_size = payload.vocab_size.unwrap_or(256);
    let engine = bpe::BPEEngine::new();
    let result = engine.train(&payload.text, vocab_size);

    ResponseJson(AnalyzeResponse {
        final_tokens: result.final_tokens,
        merge_history: result.merge_history,
        vocabulary: result.vocabulary,
    })
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/analyze", post(analyze))
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods([Method::GET, Method::POST])
                .allow_headers(Any),
        );

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();
    println!("Server running on http://127.0.0.1:3000");
    axum::serve(listener, app).await.unwrap();
}

