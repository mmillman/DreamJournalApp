class CreateDreamThemes < ActiveRecord::Migration
  def change
    create_table :dream_themes do |t|
      t.integer :dream_id
      t.integer :theme_id

      t.timestamps
    end
  end
end
