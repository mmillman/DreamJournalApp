class Theme < ActiveRecord::Base
  attr_accessible :name

  has_many :dream_themes
  has_many :dreams, :through => :dream_themes
end
