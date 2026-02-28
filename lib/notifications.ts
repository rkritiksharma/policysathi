
export async function sendNotification(to: string, message: string, channel: 'email' | 'sms' | 'whatsapp') {
    // In a real app, this would call Resend, Twilio, or WhatsApp API
    console.log(`[${channel.toUpperCase()}] To: ${to} | Message: ${message}`)
    return true
}
