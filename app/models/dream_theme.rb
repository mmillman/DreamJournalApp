class DreamTheme < ActiveRecord::Base
  attr_accessible :dream_id, :theme_id

  belongs_to :dream
  belongs_to :theme
end
