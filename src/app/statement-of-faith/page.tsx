import { BookOpen, Scroll } from "lucide-react";

export default function StatementOfFaithPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="bg-[#1E2A38] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Scroll className="w-8 h-8 text-[#C9A227]" />
            <span className="text-[#C9A227] font-semibold uppercase tracking-wider">Our Foundation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Statement of Faith</h1>
          <p className="text-xl text-gray-300">
            The core beliefs that unite our community
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card prose prose-lg max-w-none">
          <div className="mb-8 p-6 bg-[#1E2A38] text-white rounded-lg">
            <BookOpen className="w-8 h-8 text-[#C9A227] mb-4" />
            <p className="text-lg leading-relaxed">
              This Statement of Faith represents the essential beliefs of The Upper Room Forum. 
              All members and contributors affirm these truths as the foundation of our community.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1E2A38] mb-4">1. The Bible</h2>
            <p className="text-gray-700 leading-relaxed">
              We believe that the Bible, consisting of the 66 books of the Old and New Testaments, 
              is the inspired Word of God, without error in the original writings, and the supreme 
              and final authority in all matters of faith and conduct.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1E2A38] mb-4">2. God</h2>
            <p className="text-gray-700 leading-relaxed">
              We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit. 
              God is the Creator and Sustainer of all things, perfect in love, holiness, righteousness, 
              justice, and truth.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1E2A38] mb-4">3. Jesus Christ</h2>
            <p className="text-gray-700 leading-relaxed">
              We believe in Jesus Christ, the eternal Son of God, conceived by the Holy Spirit, 
              born of the virgin Mary. He lived a sinless life, died on the cross as a substitute 
              for sinners, rose bodily from the dead, ascended to heaven, and will return in glory 
              to judge the living and the dead.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1E2A38] mb-4">4. The Holy Spirit</h2>
            <p className="text-gray-700 leading-relaxed">
              We believe in the Holy Spirit, who convicts the world of sin, regenerates sinners, 
              indwells believers, and empowers them for godly living and service. The Spirit gives 
              spiritual gifts to the church for the building up of the body of Christ.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1E2A38] mb-4">5. Humanity</h2>
            <p className="text-gray-700 leading-relaxed">
              We believe that God created humans in His image, male and female, but that all 
              humanity has sinned and fallen short of God's glory. Apart from Christ, all are 
              under God's righteous judgment and condemnation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1E2A38] mb-4">6. Salvation</h2>
            <p className="text-gray-700 leading-relaxed">
              We believe that salvation is by grace alone, through faith alone, in Christ alone. 
              It is not earned by human effort or merit but is the free gift of God. Those who 
              repent of their sins and trust in Christ are forgiven, declared righteous, and 
              receive eternal life.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1E2A38] mb-4">7. The Church</h2>
            <p className="text-gray-700 leading-relaxed">
              We believe in the universal church, the body of Christ, composed of all true 
              believers. The local church is a community of believers gathered for worship, 
              fellowship, teaching, prayer, and the proclamation of the Gospel.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1E2A38] mb-4">8. The Great Commission</h2>
            <p className="text-gray-700 leading-relaxed">
              We believe that Christ has commissioned His church to make disciples of all nations, 
              baptizing them in the name of the Father, Son, and Holy Spirit, and teaching them 
              to obey all that Christ commanded.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1E2A38] mb-4">9. The Last Things</h2>
            <p className="text-gray-700 leading-relaxed">
              We believe in the personal, bodily return of Jesus Christ, the resurrection of 
              the dead, the final judgment, and the eternal blessedness of the righteous and 
              the eternal punishment of the wicked.
            </p>
          </section>

          <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-bold text-yellow-800 mb-2">Agreement Required</h3>
            <p className="text-yellow-700">
              All members of The Upper Room Forum must affirm this Statement of Faith. 
              Theological discussions should operate within this framework. Questions and 
              exploration of these beliefs are welcome, but denial of these core doctrines 
              is outside the scope of our community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
