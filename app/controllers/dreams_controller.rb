class DreamsController < ApplicationController
  def index
=begin
   http://stackoverflow.com/questions/10159735/include-has-many-results-in-rest-json-result
=end
    dreams_and_themes = Dream.includes(:themes).all

    respond_to do |format|
      format.html { render :index }
      format.json { render :json => dreams_and_themes.to_json(:include => :themes) }
    end
  end

  def create
    @dream = Dream.create!(params[:dream])

    puts "#{params[:format]}" # where does this print to?
    respond_to do |format|
      format.json { render :json => @dream }
    end
  end

end
