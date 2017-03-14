defmodule Poker.Web.Helpers do
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
end
