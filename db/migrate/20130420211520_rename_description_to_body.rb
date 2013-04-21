class RenameDescriptionToBody < ActiveRecord::Migration
  def change
    rename_column :dreams, :description, :body
  end
end
