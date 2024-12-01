DO $$ 
BEGIN 
    RAISE NOTICE 'Starting schema creation...';
END $$;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum type for gender
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender_enum') THEN
        CREATE TYPE gender_enum AS ENUM ('Male', 'Female');
    END IF;
END
$$;

-- Create cafes table
CREATE TABLE IF NOT EXISTS cafes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    logo VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email_address VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(8) NOT NULL CHECK (phone_number ~ '^[89][0-9]{7}$'),
    gender gender_enum NOT NULL,
    start_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    cafe_id UUID REFERENCES cafes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Delete duplicate employee assignments
DELETE FROM employees 
WHERE id IN (
    SELECT id 
    FROM employees 
    WHERE cafe_id IS NOT NULL 
    GROUP BY id 
    HAVING COUNT(cafe_id) > 1
);

-- Add a unique constraint to ensure one cafe per employee
ALTER TABLE employees 
ADD CONSTRAINT unique_employee_cafe 
UNIQUE (id, cafe_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cafes_location ON cafes(location);
CREATE INDEX IF NOT EXISTS idx_employees_cafe_id ON employees(cafe_id);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email_address);

DO $$ 
BEGIN 
    RAISE NOTICE 'Creating trigger function...';
END $$;

-- Add a check constraint to ensure only one non-null cafe_id per employee
CREATE OR REPLACE FUNCTION check_single_cafe() 
RETURNS trigger AS $$
BEGIN
    IF NEW.cafe_id IS NOT NULL AND EXISTS (
        SELECT 1 
        FROM employees 
        WHERE id = NEW.id 
        AND cafe_id IS NOT NULL 
        AND cafe_id != NEW.cafe_id
    ) THEN
        RAISE EXCEPTION 'Employee cannot work in multiple cafes simultaneously';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS enforce_single_cafe ON employees;
    CREATE TRIGGER enforce_single_cafe
        BEFORE INSERT OR UPDATE ON employees
        FOR EACH ROW
        EXECUTE FUNCTION check_single_cafe();
EXCEPTION WHEN others THEN
    RAISE NOTICE 'Error creating trigger: %', SQLERRM;
END $$;

DROP TRIGGER IF EXISTS update_cafes_updated_at ON cafes;
CREATE TRIGGER update_cafes_updated_at
    BEFORE UPDATE ON cafes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DO $$ 
BEGIN 
    RAISE NOTICE 'Schema creation completed.';
END $$;