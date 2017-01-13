defmodule Poker.Helpers do
  @email_regex Regex.compile!("^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}
    {\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|
    gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}
    \.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$")

  def username_regex do
    ~r{^([a-zA-Z])(\w|-)+$}
  end

  def email_regex do
    @email_regex
  end

  defmacro filterable_by(fields) do
    fields
    |> Enum.map(&generic_filter/1)
  end

  defp generic_filter(field) do
    quote do
      def filter(_conn, query, unquote(field), values)
      when is_list(values) do
        key = unquote(String.to_atom(field))

        from ref in query, where: field(ref, ^key) in ^values
      end

      def filter(_conn, query, unquote(field), value) do
        key = unquote(String.to_atom(field))

        from ref in query, where: field(ref, ^key) == ^value
      end
    end
  end
end
