ALTER TABLE tickets
ADD COLUMN sla_policy_id UUID REFERENCES sla_policies(id);