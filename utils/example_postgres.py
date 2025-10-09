import psycopg2

NAME_DB = "example_db"
USER_DB = "postgres"
PASSWORD_DB = "Pepetito4."
HOST_DB = "localhost"
PORT_DB = "5432"

conn = psycopg2.connect(
    f"dbname ={NAME_DB} user={USER_DB} password={PASSWORD_DB} host={HOST_DB} port={PORT_DB}"
)
cursor = conn.cursor()

def create_table():
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS example_table (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            age INT
        )
        """
    )
    conn.commit()

    print("Table created successfully")