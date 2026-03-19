-- Allow 'cancelled' as a valid status for party_inquiries
ALTER TABLE party_inquiries
  DROP CONSTRAINT IF EXISTS party_inquiries_status_check;

ALTER TABLE party_inquiries
  ADD CONSTRAINT party_inquiries_status_check
  CHECK (status IN ('new', 'contacted', 'confirmed', 'completed', 'cancelled'));
