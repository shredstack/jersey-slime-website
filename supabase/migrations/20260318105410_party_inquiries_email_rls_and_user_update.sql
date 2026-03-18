-- Allow users to see inquiries matched by user_id OR by email (for inquiries
-- submitted before user_id was recorded).
DROP POLICY IF EXISTS "Users can read own inquiries" ON party_inquiries;
CREATE POLICY "Users can read own inquiries"
  ON party_inquiries FOR SELECT
  USING (auth.uid() = user_id OR auth.email() = contact_email);

-- Allow users to update their own pending inquiries (new or contacted only).
CREATE POLICY "Users can update own pending inquiries"
  ON party_inquiries FOR UPDATE
  USING (
    (auth.uid() = user_id OR auth.email() = contact_email)
    AND status IN ('new', 'contacted')
  )
  WITH CHECK (
    (auth.uid() = user_id OR auth.email() = contact_email)
    AND status IN ('new', 'contacted')
  );
