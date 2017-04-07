defmodule Poker.Web.Helpers.View do
  defmacro __using__(_opts) do
    quote do
      import Poker.Web.Helpers.View

      def render("index.json", %{page: page}) do
        %{
          data: render_many(page.entries, __MODULE__, "single.json"),
          meta: %{
            page_number: page.page_number,
            page_size: page.page_size,
            total_pages: page.total_pages,
            total_entries: page.total_entries
          }
         }
      end
    end
  end
end
