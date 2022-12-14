// public/javascript/main.js

const App = {
    endpoint: '/api',
    interval: null
}

App.init = () => {
    $('#invoice-form').collapse('show');
    $('#send-btn').click(App.sendBtn);
    App.getBalance();
}

App.sendBtn = async () => {
  const amount = $('#amount').val();
  const description = $('#description').val();
  const response = await App.makeRequest({
    api: "invoice",
    post: { amount, description },
  });
  if (!response) console.error('Error getting data!');
  if (response.success) {
    $('#invoice-form').collapse('hide');
    $('#pay-invoice').collapse('show');
    $('#invoice-text').text(response.request);
    $('#invoice-description').text(description);
    $('#invoice-amount').text(`${amount} `);
    App.interval = setInterval(App.waitPayment, 2000, response.hash);
  }
};

App.makeRequest = ({api, post}) => {
    const type = !post ? 'GET' : 'POST';
    const data = !!post ? JSON.stringify(post) : null;
    return $.ajax(`${App.endpoint}/${api}`, {
      type,
      data,
      contentType: 'application/json',
      dataType: 'json',
    });
  };

App.getBalance = async (hash) => {
  const response = await App.makeRequest({
    api: `balance`,
  });
  if (response.success) {
    $('#user-balance').text(` ${response.balance} SAT`);
  }
};

App.waitPayment = async (hash) => {
  const response = await App.makeRequest({
    api: `invoice/${hash}`,
  });
  if (response.success && response.paid) {
    clearInterval(App.interval);
    App.interval = null;
    $('#pay-invoice').collapse('hide');
    $('#invoice-description').html(response.description);
    $('#invoice-preimage').html(response.preimage);
    $('#success-box').collapse('show');
    setTimeout(App.getBalance, 2000);
  }
};

$(() => App.init())