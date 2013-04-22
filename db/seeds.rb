# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


ActiveRecord::Base.transaction do
  Dream.create!(title: "Flight", body: "Pretty great.")
  Dream.create!(title: "Underwater", body: "A bit scary.")
  Dream.create!(title: "Staring at a wall", body: "Best dream ever.")
  Dream.create!(title: "Pilot time", body: "Flew an airplane")

  Theme.create!(name: "flying")
  Theme.create!(name: "drowning")
  Theme.create!(name: "airplanes")
  Theme.create!(name: "fun")

  DreamTheme.create!(dream_id: 1, theme_id: 1)
  DreamTheme.create!(dream_id: 1, theme_id: 4)
  DreamTheme.create!(dream_id: 2, theme_id: 2)
  DreamTheme.create!(dream_id: 3, theme_id: 3)
  DreamTheme.create!(dream_id: 4, theme_id: 1)

end