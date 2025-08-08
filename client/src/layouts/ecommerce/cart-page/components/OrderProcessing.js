import { useEffect } from 'react';
import useRazorpay from 'react-razorpay';

const OrderProcessing = () => {
  const Razorpay = useRazorpay();

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  useEffect(async () => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (res) {
      const rzp1 = new Razorpay({
        key: 'rzp_test_jhZylcCH8sKU8d', // pass test key or live key
        amount: '4000',
        currency: 'INR',
        name: 'PALLET MARKETPLACE',
        description: 'Test Transaction',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm03zjuDBj2_Gg6NUU9zTs1hQ9KHEXVb1JBpqiU5JRkQ&s',
        order_id: '', //Pass order id from API response
        handler: (res) => {
        },
        prefill: {
          name: 'Piyush Garg',
          email: 'youremail@example.com',
          contact: '9999999999',
        },
        notes: {
          address: 'Razorpay Corporate Office',
        },
        theme: {
          color: '#3399cc',
        },
      });

      rzp1.on('payment.failed', function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });

      rzp1.open();
    }
  }, [Razorpay]);

  return null;
};

export default OrderProcessing;
