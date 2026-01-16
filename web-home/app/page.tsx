"use client";
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const Home = () => {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [numberOfVisits, setNumberOfVisits] = useState<number>(0);
  const [returningUser, setReturningUser] = useState<boolean>(false);
  const [value, setValue] = useState<number[]>([33]);

  useEffect(() => {
    const init = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      console.log("visitorId from fingerprint:", result.visitorId);
      setVisitorId(result.visitorId);
    };
    init();
  }, []);

  useEffect(() => {
    if (!visitorId) {
      return;
    }

    const fetchVisitorData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/engagement-stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId }),
        });
        const data = await res.json();

        if (!data) {
          throw new Error();
        }
        setNumberOfVisits(data.visited ?? 0);
        setReturningUser(data.isReturning ?? false);
        setValue([data.seekerPosition ?? 33]);
        setLoading(false);
      } catch (error) {
        console.log("Error occured at ", error);
      }
    };
    fetchVisitorData();
  }, [visitorId]);

  useEffect(() => {
    if (!visitorId) {
      return;
    }
    const sliderSetup = setTimeout(() => {
      fetch("http://localhost:8000/api/update-slider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          sliderValue: value[0],
        }),
      });
    }, 1000);

    return () => clearTimeout(sliderSetup);
  }, [visitorId, value]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen justify-center items-center gap-8">
      <h1>
        Hello {returningUser ? <strong>this is a returning user</strong> : ""}
      </h1>
      <p>
        Visitor Id : <strong>{visitorId}</strong>
      </p>
      <p>
        Visits: <strong>{numberOfVisits}</strong>
      </p>

      <div className="w-80">
        <Slider value={value} max={100} step={1} onValueChange={setValue} />
        <p className="mt-2">Current value: {value[0]}</p>
      </div>
    </div>
  );
};

export default Home;
