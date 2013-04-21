# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


ActiveRecord::Base.transaction do
  Dream.create!(title: "Flying", body: "Pretty great.")
  Dream.create!(title: "Drowning", body: "A bit scary.")
  Dream.create!(title: "Staring at a wall", body: "Best dream ever.")

end