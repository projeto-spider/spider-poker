defmodule Poker.Pattern do
  def numeric?(x) when is_integer(x), do: true
  def numeric?(x) do
    x =~ ~r{^[0-9]+$}
  end

  def username() do
    ~r<^([a-zA-Z])(\w|-)+$>
  end

  def email() do
    ~r<^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}
    {\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|
    gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}
    \.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$>
  end

  def url() do
    ~r<^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$>
  end
end
