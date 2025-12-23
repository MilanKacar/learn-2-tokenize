use serde::Serialize;
use std::collections::HashMap;

#[derive(Serialize, Clone)]
pub struct Token {
    pub id: usize,
    pub value: String,
    pub byte_length: usize,
}

#[derive(Serialize, Clone)]
pub struct MergeStep {
    pub pair: (String, String),
    pub merged: String,
    pub tokens: Vec<Token>,
    pub step_number: usize,
}

pub struct TrainingResult {
    pub final_tokens: Vec<Token>,
    pub merge_history: Vec<MergeStep>,
    pub vocabulary: Vec<(String, usize)>,
}

pub struct BPEEngine;

impl BPEEngine {
    pub fn new() -> Self {
        Self
    }

    pub fn train(&self, text: &str, vocab_size: usize) -> TrainingResult {
        // Initialize: split text into characters
        let chars: Vec<char> = text.chars().collect();
        
        // Build initial vocabulary from unique characters
        let mut vocabulary: HashMap<String, usize> = HashMap::new();
        let mut next_id = 0;
        
        for &ch in &chars {
            let value = ch.to_string();
            if !vocabulary.contains_key(&value) {
                vocabulary.insert(value.clone(), next_id);
                next_id += 1;
            }
        }
        
        // Initialize tokens with proper IDs
        let mut tokens: Vec<Token> = chars
            .iter()
            .map(|ch| {
                let value = ch.to_string();
                let byte_length = value.as_bytes().len();
                let id = vocabulary[&value];
                Token {
                    id,
                    value,
                    byte_length,
                }
            })
            .collect();

        let mut merge_history = Vec::new();
        let mut step_number = 0;

        // Add initial state as step 0
        merge_history.push(MergeStep {
            pair: ("".to_string(), "".to_string()),
            merged: "".to_string(),
            tokens: tokens.clone(),
            step_number: 0,
        });

        // BPE training loop
        while vocabulary.len() < vocab_size && tokens.len() > 1 {
            // Count all adjacent pairs
            let mut pair_counts: HashMap<(String, String), usize> = HashMap::new();
            
            for i in 0..tokens.len() - 1 {
                let pair = (tokens[i].value.clone(), tokens[i + 1].value.clone());
                *pair_counts.entry(pair).or_insert(0) += 1;
            }

            // Find the most frequent pair
            let best_pair = pair_counts
                .iter()
                .max_by_key(|(_, count)| **count)
                .map(|(pair, _)| pair.clone());

            if let Some((first, second)) = best_pair {
                let merged = format!("{}{}", first, second);
                
                // Merge tokens
                let mut new_tokens = Vec::new();
                let mut i = 0;
                
                while i < tokens.len() {
                    if i < tokens.len() - 1 
                        && tokens[i].value == first 
                        && tokens[i + 1].value == second 
                    {
                        // Merge this pair
                        let merged_value = merged.clone();
                        let byte_length = merged_value.as_bytes().len();
                        
                        if !vocabulary.contains_key(&merged_value) {
                            vocabulary.insert(merged_value.clone(), next_id);
                            next_id += 1;
                        }
                        
                        let token_id = vocabulary[&merged_value];
                        new_tokens.push(Token {
                            id: token_id,
                            value: merged_value,
                            byte_length,
                        });
                        i += 2; // Skip both tokens
                    } else {
                        new_tokens.push(tokens[i].clone());
                        i += 1;
                    }
                }

                // Record merge step
                step_number += 1;
                merge_history.push(MergeStep {
                    pair: (first.clone(), second.clone()),
                    merged: merged.clone(),
                    tokens: new_tokens.clone(),
                    step_number,
                });

                tokens = new_tokens;
            } else {
                // No more pairs to merge
                break;
            }
        }

        // Build vocabulary list sorted by ID
        let mut vocab_list: Vec<(String, usize)> = vocabulary.into_iter().collect();
        vocab_list.sort_by_key(|(_, id)| *id);

        TrainingResult {
            final_tokens: tokens,
            merge_history,
            vocabulary: vocab_list,
        }
    }
}

impl Default for BPEEngine {
    fn default() -> Self {
        Self::new()
    }
}

