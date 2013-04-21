class CreateDreams < ActiveRecord::Migration
  def change
    create_table :dreams do |t|
      t.string :title
      t.string :description

      t.timestamps
    end
  end
end
