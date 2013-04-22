class Dream < ActiveRecord::Base
  attr_accessible :title, :body, :tag_ids

  has_many :dream_themes
  has_many :themes, :through => :dream_themes
end
