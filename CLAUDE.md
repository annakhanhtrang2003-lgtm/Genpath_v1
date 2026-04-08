## Data Files — QUAN TRỌNG

Project có 3 file dữ liệu đã được validate thủ công. PHẢI dùng data từ các file này, KHÔNG ĐƯỢC tự generate data.

### src/data/scoring_data.json
- 24 câu hỏi, 83 đáp án, scoring weights cho Layer A/B/C
- KHÔNG thay đổi weight

### src/data/market_data.json
- 8 ngành × salary × demand × AI risk, verified từ job postings thật
- KHÔNG tự bịa số liệu

### src/data/roadmap_template.json
- 7 breeds × 4 năm × 16 tasks mỗi breed + 5 quick wins
- Resources chỉ dùng từ danh sách curated, KHÔNG thêm URL chưa verify
