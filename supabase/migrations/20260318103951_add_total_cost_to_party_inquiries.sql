ALTER TABLE party_inquiries
  ADD COLUMN total_cost numeric CHECK (total_cost >= 0);
