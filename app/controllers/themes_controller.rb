class ThemesController < ApplicationController
  def index
    respond_to do |format|
      format.json { render :json => Theme.all.to_json }
    end
  end
end
