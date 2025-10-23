#!/usr/bin/env python3
"""
Script to create SQLite database from DEPOT CSV file
"""
import sqlite3
import csv
import os

# Database configuration
DB_PATH = 'data/depot.db'
CSV_PATH = 'public/data/DEPOT (last year).csv'

def create_database():
    """Create the SQLite database and table schema"""
    
    # Remove existing database if it exists
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
        print(f"Removed existing database: {DB_PATH}")
    
    # Create data directory if it doesn't exist
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    
    # Connect to database (creates it if it doesn't exist)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create depot table with all columns from CSV
    cursor.execute('''
        CREATE TABLE depot (
            Edit TEXT,
            ID TEXT PRIMARY KEY,
            Model TEXT,
            FcnlRev TEXT,
            Serial TEXT,
            Po TEXT,
            Account TEXT,
            Makername TEXT,
            Nickname TEXT,
            Location TEXT,
            LastDate TEXT,
            LocationId TEXT,
            NickId TEXT,
            MakernameUpper TEXT,
            ModelUpper TEXT,
            NicknameUpper TEXT,
            CommentsUpper TEXT,
            LocPhyUpper TEXT,
            AssignedToUpper TEXT,
            SympFixWords TEXT,
            CUERisk TEXT,
            CueAdmin TEXT,
            CueOrg TEXT,
            Amps TEXT,
            AssignedTo TEXT,
            CUECategory TEXT,
            CUEFire TEXT,
            CUEMission TEXT,
            CUEMissionNonCUE TEXT,
            CUEPersonnel TEXT,
            CUESubCategory TEXT,
            Class TEXT,
            Comments TEXT,
            Cost TEXT,
            CreatedBy TEXT,
            CreatedDate TEXT,
            DateReceived TEXT,
            Devicecode TEXT,
            DrawMakerId TEXT,
            DrawModel TEXT,
            Drawing TEXT,
            DrawrRev TEXT,
            EEIPNo TEXT,
            EeipInspDate TEXT,
            Experiment TEXT,
            Generic TEXT,
            LastMaint TEXT,
            LocId TEXT,
            LocatTimes TEXT,
            MacAddress TEXT,
            MaintGroup TEXT,
            MaintTimes TEXT,
            Makerfile TEXT,
            ModifiedBy TEXT,
            ModifiedDate TEXT,
            NumCd TEXT,
            NumLoc TEXT,
            NumMaint TEXT,
            NumProc TEXT,
            OwningGroup TEXT,
            ParentId TEXT,
            ParentSlot TEXT,
            Shop TEXT,
            State TEXT,
            Subsystem TEXT,
            TldFlag TEXT,
            UserName TEXT,
            UserPhone TEXT,
            UsingGroup TEXT,
            UtilEquip TEXT,
            UtilFireRisk TEXT,
            UtilMissionRisk TEXT,
            UtilPersonnelRisk TEXT,
            Verify TEXT,
            VerifyUserid TEXT,
            Volts TEXT
        )
    ''')
    
    print(f"Created database table: depot")
    
    return conn, cursor

def load_csv_data(conn, cursor):
    """Load data from CSV file into the database"""
    
    # Try different encodings
    encodings = ['utf-8', 'latin-1', 'iso-8859-1', 'cp1252', 'utf-16']
    csvfile = None
    encoding_used = None
    
    for encoding in encodings:
        try:
            # Test if we can read the entire file with this encoding
            with open(CSV_PATH, 'r', encoding=encoding) as test_file:
                test_file.read()
            
            # If successful, open for real
            csvfile = open(CSV_PATH, 'r', encoding=encoding)
            encoding_used = encoding
            print(f"Successfully opened CSV with {encoding} encoding")
            break
        except (UnicodeDecodeError, UnicodeError):
            continue
    
    if not csvfile:
        raise Exception("Could not open CSV file with any supported encoding")
    
    with csvfile:
        csv_reader = csv.DictReader(csvfile)
        
        # Prepare insert statement
        columns = csv_reader.fieldnames
        placeholders = ','.join(['?' for _ in columns])
        insert_sql = f"INSERT INTO depot VALUES ({placeholders})"
        
        # Insert rows
        row_count = 0
        for row in csv_reader:
            values = [row[col] for col in columns]
            cursor.execute(insert_sql, values)
            row_count += 1
            
            if row_count % 100 == 0:
                print(f"Inserted {row_count} rows...")
        
        conn.commit()
        print(f"Successfully loaded {row_count} rows from CSV")

def create_indexes(cursor, conn):
    """Create indexes for commonly queried columns"""
    
    print("\nCreating indexes...")
    
    indexes = [
        ("idx_location", "Location"),
        ("idx_state", "State"),
        ("idx_nickname", "Nickname"),
        ("idx_serial", "Serial"),
        ("idx_model", "Model"),
        ("idx_makername", "Makername"),
    ]
    
    for index_name, column in indexes:
        cursor.execute(f"CREATE INDEX {index_name} ON depot({column})")
        print(f"Created index: {index_name}")
    
    conn.commit()

def verify_database(cursor):
    """Verify the database was created correctly"""
    
    print("\n=== Database Verification ===")
    
    # Count total records
    cursor.execute("SELECT COUNT(*) FROM depot")
    count = cursor.fetchone()[0]
    print(f"Total records: {count}")
    
    # Sample query: Count by state
    cursor.execute("SELECT State, COUNT(*) as count FROM depot GROUP BY State ORDER BY count DESC LIMIT 10")
    print("\nTop 10 States by count:")
    for row in cursor.fetchall():
        print(f"  {row[0]}: {row[1]}")
    
    # Sample query: Recent items
    cursor.execute("SELECT ID, Nickname, Location, State FROM depot LIMIT 5")
    print("\nSample records:")
    for row in cursor.fetchall():
        print(f"  ID: {row[0]}, Name: {row[1]}, Location: {row[2]}, State: {row[3]}")

def main():
    """Main function to create and populate the database"""
    
    print("=== DEPOT Database Creation ===\n")
    
    # Create database and schema
    conn, cursor = create_database()
    
    # Load CSV data
    print("\nLoading CSV data...")
    load_csv_data(conn, cursor)
    
    # Create indexes
    create_indexes(cursor, conn)
    
    # Verify the database
    verify_database(cursor)
    
    # Close connection
    conn.close()
    
    print(f"\n✓ Database created successfully at: {DB_PATH}")
    print("\nNext steps:")
    print("1. You can query the database using SQLite tools or Python")
    print("2. Consider adding more indexes based on your query patterns")
    print("3. You may want to normalize the schema for better performance")
    print("4. Set up regular backups of your database")

if __name__ == "__main__":
    main()
