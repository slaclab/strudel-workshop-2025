# DEPOT SQLite Database Setup

## Overview

This directory contains scripts to create and manage a SQLite database from your DEPOT CSV file.

**Database Location:** `data/depot.db`  
**Source CSV:** `public/data/DEPOT (last year).csv`  
**Total Records:** 2,655 equipment items

## Database Schema

The database has a single table called `depot` with 81 columns representing all fields from the CSV:

**Key Columns:**
- `ID` (Primary Key) - Unique equipment identifier
- `Nickname` - Equipment name
- `Location` - Physical location
- `State` - Equipment state (IN USE, NEW, READY, SPARE, etc.)
- `Model` - Equipment model
- `Makername` - Manufacturer name
- `Serial` - Serial number
- `Cost` - Equipment cost
- `LastDate` - Last activity date

**Indexes created for fast queries:**
- `idx_location` - Location field
- `idx_state` - State field
- `idx_nickname` - Nickname field
- `idx_serial` - Serial number
- `idx_model` - Model field
- `idx_makername` - Manufacturer name

## Quick Start

### 1. Create/Refresh the Database

```bash
python3 scripts/create_depot_database.py
```

This script will:
- ✓ Create the database at `data/depot.db`
- ✓ Load all 2,655 records from the CSV
- ✓ Create indexes for performance
- ✓ Verify data integrity

### 2. Query the Database

#### Using Python:

```python
import sqlite3

# Connect to database
conn = sqlite3.connect('data/depot.db')
cursor = conn.cursor()

# Example queries
cursor.execute("SELECT * FROM depot WHERE State = 'IN USE'")
in_use_items = cursor.fetchall()

cursor.execute("SELECT * FROM depot WHERE Location LIKE '%B118%'")
b118_items = cursor.fetchall()

cursor.execute("""
    SELECT State, COUNT(*) as count 
    FROM depot 
    GROUP BY State 
    ORDER BY count DESC
""")
state_summary = cursor.fetchall()

conn.close()
```

#### Using SQLite CLI:

```bash
sqlite3 data/depot.db

# Interactive queries
sqlite> SELECT COUNT(*) FROM depot;
sqlite> SELECT * FROM depot WHERE State = 'NEW' LIMIT 10;
sqlite> SELECT Location, COUNT(*) FROM depot GROUP BY Location;
sqlite> .schema depot
sqlite> .quit
```

## Integration with STRUDEL Application

### Option 1: Python Backend API

Create a simple Flask/FastAPI server to query the database:

```python
from flask import Flask, jsonify, request
import sqlite3

app = Flask(__name__)
DB_PATH = 'data/depot.db'

@app.route('/api/depot/search')
def search_depot():
    query = request.args.get('q', '')
    state = request.args.get('state', '')
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    sql = "SELECT * FROM depot WHERE 1=1"
    params = []
    
    if query:
        sql += " AND (Nickname LIKE ? OR Model LIKE ?)"
        params.extend([f'%{query}%', f'%{query}%'])
    
    if state:
        sql += " AND State = ?"
        params.append(state)
    
    cursor.execute(sql, params)
    results = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

### Option 2: Direct Integration with React

Use a Node.js backend with `better-sqlite3`:

```javascript
// server.js
const express = require('express');
const Database = require('better-sqlite3');

const app = express();
const db = new Database('data/depot.db');

app.get('/api/depot/search', (req, res) => {
  const { state, location } = req.query;
  
  let sql = 'SELECT * FROM depot WHERE 1=1';
  const params = [];
  
  if (state) {
    sql += ' AND State = ?';
    params.push(state);
  }
  
  if (location) {
    sql += ' AND Location LIKE ?';
    params.push(`%${location}%`);
  }
  
  const stmt = db.prepare(sql);
  const results = stmt.all(...params);
  
  res.json(results);
});

app.listen(3001, () => {
  console.log('API running on port 3001');
});
```

### Option 3: Export to JSON for Frontend

Generate JSON files for static hosting:

```python
import sqlite3
import json

conn = sqlite3.connect('data/depot.db')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Export all data
cursor.execute("SELECT * FROM depot")
all_data = [dict(row) for row in cursor.fetchall()]

with open('public/data/depot.json', 'w') as f:
    json.dump(all_data, f, indent=2)

# Export summary by state
cursor.execute("""
    SELECT State, COUNT(*) as count 
    FROM depot 
    GROUP BY State 
    ORDER BY count DESC
""")
summary = [dict(row) for row in cursor.fetchall()]

with open('public/data/depot_summary.json', 'w') as f:
    json.dump(summary, f, indent=2)

conn.close()
print("✓ JSON files created in public/data/")
```

## Common Queries

### Find Equipment by Location
```sql
SELECT * FROM depot 
WHERE Location LIKE '%B118%' 
ORDER BY Nickname;
```

### Get Equipment Counts by State
```sql
SELECT State, COUNT(*) as total 
FROM depot 
GROUP BY State 
ORDER BY total DESC;
```

### Find Equipment by Manufacturer
```sql
SELECT * FROM depot 
WHERE Makername LIKE '%KEPCO%' 
ORDER BY Model;
```

### Search by Multiple Criteria
```sql
SELECT * FROM depot 
WHERE State = 'IN USE' 
  AND Location LIKE '%B24%' 
  AND Model IS NOT NULL
LIMIT 100;
```

### Get Cost Summary
```sql
SELECT State, 
       COUNT(*) as count,
       SUM(CAST(Cost AS REAL)) as total_cost
FROM depot 
WHERE Cost != '' 
GROUP BY State;
```

## Maintenance Tasks

### Backup Database
```bash
# Create timestamped backup
cp data/depot.db data/depot_backup_$(date +%Y%m%d).db

# Or use SQLite backup
sqlite3 data/depot.db ".backup 'data/depot_backup.db'"
```

### Update Database from New CSV
```bash
# Simply run the creation script again
python3 scripts/create_depot_database.py
```

### Check Database Integrity
```bash
sqlite3 data/depot.db "PRAGMA integrity_check;"
```

### Optimize Database
```bash
sqlite3 data/depot.db "VACUUM; ANALYZE;"
```

## Performance Tips

1. **Use Indexes:** The script creates indexes on commonly queried fields
2. **Limit Results:** Use `LIMIT` clause for large result sets
3. **Use Prepared Statements:** Prevents SQL injection and improves performance
4. **Connection Pooling:** Reuse database connections in production

## Next Steps

1. **Add More Indexes:** Based on your specific query patterns
   ```sql
   CREATE INDEX idx_custom ON depot(YourColumn);
   ```

2. **Normalize Schema:** Consider splitting into multiple tables if needed
   - Equipment table
   - Locations table
   - Manufacturers table

3. **Add Full-Text Search:** For better text searching
   ```sql
   CREATE VIRTUAL TABLE depot_fts USING fts5(Nickname, Model, Location);
   ```

4. **Set Up Backups:** Implement automated backup schedule

5. **Create Views:** For commonly used queries
   ```sql
   CREATE VIEW active_equipment AS 
   SELECT * FROM depot WHERE State = 'IN USE';
   ```

## Troubleshooting

**Database locked:**
- Close all connections before running the creation script
- Use `conn.close()` in Python scripts

**Memory issues:**
- Use cursor iteration instead of `fetchall()` for large queries
- Add pagination with `LIMIT` and `OFFSET`

**Encoding issues:**
- The script handles multiple encodings (latin-1, utf-8, etc.)
- Original file used latin-1 encoding

## Resources

- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Python sqlite3 Module](https://docs.python.org/3/library/sqlite3.html)
- [Better SQLite3 for Node](https://github.com/WiseLibs/better-sqlite3)
