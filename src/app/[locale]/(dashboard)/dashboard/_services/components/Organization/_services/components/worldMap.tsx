/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type WorldAtlas = Topology<{
    countries: GeometryCollection;
}>;

const WorldMap: React.FC = () => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const countriesRef = useRef<GeoJSON.Feature<GeoJSON.Geometry>[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const customLabels: Record<string, { label: string }> = {
        Thailand: { label: "11,320 visits" },
        Egypt: { label: "5,200 visits" },
        Germany: { label: "8,500 visits" },
    };

    // Mount map only once
    useEffect(() => {
        const width = 960;
        const height = 500;
        const svg = d3.select(svgRef.current);

        const projection = d3
            .geoMercator()
            .scale(150)
            .translate([width / 2, height / 1.4]);

        const path = d3.geoPath().projection(projection);

        d3.json<WorldAtlas>(
            "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
        ).then((worldData) => {
            if (!worldData) return;

            const countries = (
                topojson.feature(
                    worldData,
                    worldData.objects.countries
                ) as unknown as GeoJSON.FeatureCollection<
                    GeoJSON.Geometry,
                    GeoJSON.GeoJsonProperties
                >
            ).features;

            countriesRef.current = countries;

            // Draw countries once
            svg
                .append("g")
                .selectAll<SVGPathElement, GeoJSON.Feature<GeoJSON.Geometry>>(".country")
                .data(countries)
                .join("path")
                .attr("class", "country")
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .attr("d", path as any)
                .attr("fill", (d) => {
                    const name = d.properties?.name as string;
                    return customLabels[name] ? "#007EF9" : "#D9D9D9"; // ✅ highlight on first render
                })
                .attr("stroke", "#fff")
                .attr("stroke-width", 0.4)
                .on("mouseover", function () {
                    d3.select(this).attr("fill", "#66B2FB");
                })
                .on("mouseout", function (_, d) {
                    const name = d.properties?.name as string;
                    const hasLabel = !!customLabels[name];
                    d3.select(this).attr("fill", hasLabel ? "#007EF9" : "#D9D9D9");
                });

            // Add custom labels
            svg
                .append("g")
                .selectAll("g.label")
                .data(
                    countries.filter((d) => {
                        const name = d.properties?.name as string;
                        return name && customLabels[name];
                    })
                )
                .join("g")
                .attr("class", "label")
                .each(function (d) {
                    const [x, y] = path.centroid(d);
                    const g = d3.select(this);

                    g.append("rect")
                        .attr("x", x + 10)
                        .attr("y", y)
                        .attr("width", 120)
                        .attr("height", 40)
                        .attr("rx", 6)
                        .attr("fill", "white")
                        .attr("borderRadius", "10px")
                        .attr("opacity", 1);

                    g.append("rect")
                        .attr("x", x + 20)
                        .attr("y", y + 25)
                        .attr("width", 8)
                        .attr("height", 8)
                        .attr("rx", 6)
                        .attr("fill", "#007EF9")
                        .attr("borderRadius", "10px")
                        .attr("opacity", 1);

                    g.append("text")
                        .attr("x", x + 20)
                        .attr("y", y + 17)
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold")
                        .text(d.properties?.name as string);

                    g.append("text")
                        .attr("x", x + 35)
                        .attr("y", y + 30)
                        .attr("font-size", "12px")
                        .text(customLabels[d.properties?.name as string].label);
                });
        });
    }, []);

    // Update country colors only when search changes
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const search = searchTerm.trim().toLowerCase();

        svg.selectAll<SVGPathElement, GeoJSON.Feature<GeoJSON.Geometry>>(".country")
            .attr("fill", (d) => {
                const name = d.properties?.name as string;
                const hasLabel = !!customLabels[name];
                const isSearched = search && name?.toLowerCase().includes(search);
                if (isSearched) return "#007EF9";
                if (hasLabel) return "#66B2FB";
                return "#D9D9D9";
            });
    }, [searchTerm]);

    return (
        <div className="flex flex-col items-center relative">
            <div className="w-80 absolute top-4 left-4">
                <Input
                    id="search"
                    type="text"
                    icon={<Search size={20} />}
                    iconPosition="right"
                    placeholder="Search for a country (e.g., Egypt)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white"
                />
            </div>

            <svg
                ref={svgRef}
                viewBox="0 0 960 400"
                className="w-full h-[400px]"
            />
        </div>
    );
};

export default WorldMap;
