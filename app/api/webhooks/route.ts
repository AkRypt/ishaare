import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { useRouter } from "next/navigation";

const stripe = new Stripe(process.env.TEST_STRIPE_SECRET as string, {
    apiVersion: "2024-04-10",
});

const endpointSecret = process.env.TEST_WEBHOOK_SECRET as string;

// Make sure to add this, otherwise you will get a stream.not.readable error
// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };


export async function POST(req: NextRequest, res: NextResponse) {

    const payload = await req.text()
    const response = JSON.parse(payload)
    const sig = req.headers.get('stripe-signature')

    const dateTime = new Date(response.created * 1000).toLocaleDateString()
    const timeString = new Date(response.created * 1000).toLocaleDateString()

    try {
        let event = stripe.webhooks.constructEvent(payload, sig!, endpointSecret);

        if (event.type === "checkout.session.completed") {

            try {
                const session = event.data.object as Stripe.Checkout.Session
                const metadata = session.metadata
                const topicId = parseInt(metadata?.topic_id!)
                const custEmail = session.customer_details?.email

                let updatedTopics: number[] = []

                const supabase = await supabaseAdmin();
                await supabase
                    .from('users')
                    .select('purchased_topics')
                    .eq('email', custEmail)
                    .single()
                    .then(({ data, error }) => {
                        if (error) {
                            console.error('Error fetching user data:', error.message);
                            return;
                        }

                        if (!data) {
                            console.error('User not found');
                            return;
                        }

                        const currentTopics = data.purchased_topics || [];
                        updatedTopics = [...currentTopics, topicId];

                    })

                // Update the user's topics array in the database
                if (updatedTopics.length > 0) {
                    await supabase
                        .from('users')
                        .update({ purchased_topics: updatedTopics })
                        .eq('email', custEmail)
                        .then(({ data, error }) => {
                            if (error) {
                                console.error('Error updating user topics:', error.message);
                                return;
                            }
                        })
                }
            } catch (error) {
                console.log("Handling when you're unable to save an order");
                console.error(error)
                return NextResponse.json({ status: "Failed", error })
            }
        }

        return NextResponse.json({
            status: "Success",
            eventType: event.type
        })
    } catch (err: any) {
        console.log("err:", err)
        return NextResponse.json({ status: "Failed", err })
    }

}