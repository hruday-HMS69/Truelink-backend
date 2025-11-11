-- Add connections table
CREATE TABLE connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure users can't have duplicate connection requests
    UNIQUE(sender_id, receiver_id),
    
    -- Ensure users can't connect to themselves
    CHECK (sender_id != receiver_id)
);

-- Indexes for faster queries
CREATE INDEX idx_connections_sender_id ON connections(sender_id);
CREATE INDEX idx_connections_receiver_id ON connections(receiver_id);
CREATE INDEX idx_connections_status ON connections(status);
CREATE INDEX idx_connections_sender_receiver ON connections(sender_id, receiver_id);

-- Add updated_at trigger (if you don't have one already)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_connections_updated_at 
    BEFORE UPDATE ON connections 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
