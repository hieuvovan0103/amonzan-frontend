export type Category =
  | {
      id: number;
      title: string;
      subtitle: string;
      type: "single-image";
      image: string;
      links: string[];
    }
  | {
      id: number;
      title: string;
      subtitle: string;
      type: "split-image";
      images: { url: string; label: string }[];
      links: string[];
    }
  | {
      id: number;
      title: string;
      subtitle: string;
      type: "text-grid";
      links: string[];
    };