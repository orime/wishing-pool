-- 修改todos表，添加外键关联profiles
ALTER TABLE todos 
ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES profiles(user_id);

-- 更新现有数据的profile_id
UPDATE todos t
SET profile_id = p.user_id
FROM profiles p
WHERE t.user_id = p.user_id;

-- 创建联合视图更方便查询
CREATE OR REPLACE VIEW todos_with_profiles AS
SELECT t.*, p.email as creator_email
FROM todos t
LEFT JOIN profiles p ON t.profile_id = p.user_id;

-- 简化后的查询语句示例
-- SELECT * FROM todos_with_profiles ORDER BY created_at DESC;
