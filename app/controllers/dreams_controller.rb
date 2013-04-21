class DreamsController < ApplicationController
  def index
    respond_to do |format|
      format.html { render :index }
      format.json { render :json => Dream.all }
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
