import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const payload = await req.json()
    const { record, old_record } = payload

    // Database Webhook checks if status changed
    if (record && old_record && record.status !== old_record.status) {
      // Note: In production, query the user's email using the Supabase Admin client
      // const res = await supabase.from('users').select('email').eq('id', record.reporter_id).single()
      
      const emailHtml = `
        <h2>Update on your Civic Issue</h2>
        <p>Hello! The status of your issue <strong>"${record.title}"</strong> has been updated.</p>
        <p>New Status: <strong>${record.status.replace("_", " ")}</strong></p>
        <p>If you have any questions, feel free to reply to this email.</p>
        <br/>
        <p>Thank you for using the Civic Sense Platform.</p>
      `;

      if (RESEND_API_KEY) {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Civic Sense <updates@civicsense.app>',
            to: ['user@example.com'], // Replace with actual reporter's email
            subject: 'Status Update: ' + record.title,
            html: emailHtml
          })
        });

        if (res.ok) {
           return new Response(JSON.stringify({ message: "Email sent successfully!" }), { status: 200 })
        } else {
           const errorData = await res.json()
           return new Response(JSON.stringify({ error: errorData }), { status: 400 })
        }
      } else {
        // Mock sending if no API key is set
        console.log("Mock Email Sent:", emailHtml)
        return new Response(JSON.stringify({ message: "Mock email logged (No RESEND_API_KEY found)" }), { status: 200 })
      }
    }

    return new Response(JSON.stringify({ message: "No relevant status change detected" }), { status: 200 })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
