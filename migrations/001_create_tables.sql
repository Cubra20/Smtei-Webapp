-- initial schema for SMTEI application

-- users table holds both candidates and admins
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    dob DATE,
    account_type TEXT,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user', -- 'user' or 'admin'
    created_at timestamptz DEFAULT now()
);

-- inquiries submitted by anyone (authenticated or not)
CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,    -- users table holds both candidates and admins
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        dob DATE,
        account_type TEXT,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user', -- 'user' or 'admin'
        created_at timestamptz DEFAULT now()
    );
    
    -- inquiries submitted by anyone (authenticated or not)
    CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        company_name TEXT,
        contact_person TEXT,
        email TEXT,
        phone TEXT,
        message TEXT,
        created_at timestamptz DEFAULT now()
    );
    
    -- application records from the candidate form
    CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        complete_name TEXT,
        email TEXT,
        phone TEXT,
        qualification TEXT,
        coc_title TEXT,
        files JSONB, -- array/object describing uploaded files/urls
        status TEXT NOT NULL DEFAULT 'new',
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz
    );
    
    -- optional notifications table if you want to track messages
    CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        read BOOLEAN NOT NULL DEFAULT false,
        created_at timestamptz DEFAULT now()
    );
    company_name TEXT,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    message TEXT,
    created_at timestamptz DEFAULT now()
);

-- application records from the candidate form
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    complete_name TEXT,
    email TEXT,
    phone TEXT,
    qualification TEXT,
    coc_title TEXT,
    files JSONB, -- array/object describing uploaded files/urls
    status TEXT NOT NULL DEFAULT 'new',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz
);

-- optional notifications table if you want to track messages
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    created_at timestamptz DEFAULT now()
);
