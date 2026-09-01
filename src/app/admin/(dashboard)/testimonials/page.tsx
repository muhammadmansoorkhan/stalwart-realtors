import { AdminPageHeader } from "@/components/admin/page-header";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { getAdminTestimonials } from "@/lib/data/admin";

export default async function AdminTestimonialsPage() { const testimonials = await getAdminTestimonials(); return <><AdminPageHeader eyebrow="Content" title="Testimonials" description="Add only testimonials whose wording and attribution have been verified. There is no seed content." /><div className="grid gap-5"><TestimonialForm />{testimonials.map((testimonial) => <TestimonialForm key={testimonial.id} testimonial={testimonial} />)}</div></>; }
