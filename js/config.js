/* Tri Brothers site configuration.
   FORM DELIVERY: forms run in demo mode while formEndpoint is null (nothing is sent).
   To go live, set formEndpoint to "https://formsubmit.co/ajax/info@tribrothersusa.com".
   FormSubmit emails every submission to that inbox, and the first live submission
   triggers a one-time activation email that must be confirmed from info@tribrothersusa.com.
   autoResponse is sent to the person who submitted when the endpoint is live. */
window.TB_CONFIG = {
  formEndpoint: null,
  inbox: "info@tribrothersusa.com",
  portalUrl: "https://account.tribrothersusa.com/",
  autoResponse: "Thank you for contacting Tri Brothers LLC. We have received your request and a member of our team will be in touch shortly. For anything urgent, call (469) 908-1110."
};
