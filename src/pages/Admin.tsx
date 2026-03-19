import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type SiteSettings = {
  id?: string | number;
  hero_title?: string;
  hero_image_url?: string;
  hero_subtitle?: string;
  hero_button_text?: string;
  hero_video_url?: string;
  hero_mode?: string;
  music_url?: string;
  about_image_url?: string;
  about_title_1?: string;
  about_title_2?: string;
  about_title_3?: string;
  about_description?: string;
  merch_eyebrow?: string;
  merch_title?: string;
  address?: string;
  phone?: string;
  email?: string;
  instagram?: string;
  opening_hours?: string;
  map_url?: string;
};

type MenuItem = {
  id: number | string;
  name: string;
  description?: string;
  price: string;
  category: string;
};

type GalleryItem = {
  id: number | string;
  image_url: string;
  description?: string;
};

type MerchItem = {
  id: number | string;
  name: string;
  subtitle?: string;
  price: string;
  label?: string;
  image_url?: string;
};

type MerchImage = {
  id: number | string;
  merch_id: number | string;
  image_url: string;
  sort_order?: number;
};

type Tab =
  | "hero"
  | "about"
  | "merchHeader"
  | "menu"
  | "gallery"
  | "merch"
  | "footer";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none";
const textareaClass =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none resize-none";
const smallBtn = "px-3 py-2 rounded-lg font-bold transition";
const tabBtn = (active: boolean) =>
  `w-full text-left px-4 py-3 rounded-xl transition ${
    active ? "bg-white text-black font-bold" : "bg-white/5 hover:bg-white/10"
  }`;

const Admin = () => {
  const [activeTab, setActiveTab] = useState<Tab>("hero");

  const [settings, setSettings] = useState<SiteSettings>({});
  const [settingsId, setSettingsId] = useState<string | number | null>(null);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [merchItems, setMerchItems] = useState<MerchItem[]>([]);
  const [merchImages, setMerchImages] = useState<MerchImage[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const [selectedMerchId, setSelectedMerchId] = useState<string | number | null>(null);

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
      const folder = file.type.startsWith("audio/")
        ? "audio"
        : file.type.startsWith("video/")
        ? "video"
        : "images";

      const fileName = `${Date.now()}-${safeName}`;
      const filePath = `admin/${folder}/${fileName}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage.from("media").getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      const [
        settingsRes,
        menuRes,
        galleryRes,
        merchRes,
        merchImagesRes,
      ] = await Promise.all([
        supabase.from("site_settings").select("*").single(),
        supabase.from("menu_items").select("*").order("id", { ascending: true }),
        supabase.from("gallery").select("*").order("id", { ascending: true }),
        supabase.from("merch_items").select("*").order("id", { ascending: true }),
        supabase.from("merch_images").select("*").order("sort_order", { ascending: true }),
      ]);

      if (!settingsRes.error && settingsRes.data) {
        setSettings(settingsRes.data);
        setSettingsId(settingsRes.data.id);
      }

      if (!menuRes.error && menuRes.data) {
        setMenuItems(menuRes.data as MenuItem[]);
      }

      if (!galleryRes.error && galleryRes.data) {
        setGalleryItems(galleryRes.data as GalleryItem[]);
      }

      if (!merchRes.error && merchRes.data) {
        const merch = merchRes.data as MerchItem[];
        setMerchItems(merch);
        if (merch.length > 0) setSelectedMerchId(merch[0].id);
      }

      if (!merchImagesRes.error && merchImagesRes.data) {
        setMerchImages(merchImagesRes.data as MerchImage[]);
      }

      setLoading(false);
    };

    fetchAll();
  }, []);

  const selectedMerchImages = useMemo(() => {
    return merchImages.filter((img) => img.merch_id === selectedMerchId);
  }, [merchImages, selectedMerchId]);

  const handleSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setSettings((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveSettings = async () => {
    if (!settingsId) return;

    setSavingSettings(true);
    setMessage("");

    const { error } = await supabase
      .from("site_settings")
      .update(settings)
      .eq("id", settingsId);

    setMessage(error ? "Fehler beim Speichern." : "Gespeichert.");
    setSavingSettings(false);
  };

  const updateMenuField = (
    id: number | string,
    field: keyof MenuItem,
    value: string
  ) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const saveMenuItem = async (item: MenuItem) => {
    await supabase.from("menu_items").update(item).eq("id", item.id);
    setMessage("Menü gespeichert.");
  };

  const addMenuItem = async () => {
    const { data } = await supabase
      .from("menu_items")
      .insert({
        name: "New Item",
        description: "",
        price: "0€",
        category: "Kaffee",
      })
      .select()
      .single();

    if (data) {
      setMenuItems((prev) => [...prev, data as MenuItem]);
    }
  };

  const deleteMenuItem = async (id: number | string) => {
    await supabase.from("menu_items").delete().eq("id", id);
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateGalleryField = (
    id: number | string,
    field: keyof GalleryItem,
    value: string
  ) => {
    setGalleryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const saveGalleryItem = async (item: GalleryItem) => {
    await supabase.from("gallery").update(item).eq("id", item.id);
    setMessage("Galerie gespeichert.");
  };

  const addGalleryItem = async () => {
    const { data } = await supabase
      .from("gallery")
      .insert({
        image_url: "",
        description: "",
      })
      .select()
      .single();

    if (data) {
      setGalleryItems((prev) => [...prev, data as GalleryItem]);
    }
  };

  const deleteGalleryItem = async (id: number | string) => {
    await supabase.from("gallery").delete().eq("id", id);
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateMerchField = (
    id: number | string,
    field: keyof MerchItem,
    value: string
  ) => {
    setMerchItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const saveMerchItem = async (item: MerchItem) => {
    await supabase.from("merch_items").update(item).eq("id", item.id);
    setMessage("Merch gespeichert.");
  };

  const addMerchItem = async () => {
    const { data } = await supabase
      .from("merch_items")
      .insert({
        name: "New Product",
        subtitle: "",
        price: "0€",
        label: "NEW",
        image_url: "",
      })
      .select()
      .single();

    if (data) {
      const newItem = data as MerchItem;
      setMerchItems((prev) => [...prev, newItem]);
      setSelectedMerchId(newItem.id);
    }
  };

  const deleteMerchItem = async (id: number | string) => {
    await supabase.from("merch_images").delete().eq("merch_id", id);
    await supabase.from("merch_items").delete().eq("id", id);

    setMerchItems((prev) => prev.filter((item) => item.id !== id));
    setMerchImages((prev) => prev.filter((img) => img.merch_id !== id));

    const remaining = merchItems.filter((m) => m.id !== id);
    setSelectedMerchId(remaining[0]?.id || null);
  };

  const updateMerchImageField = (
    id: number | string,
    field: keyof MerchImage,
    value: string | number
  ) => {
    setMerchImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, [field]: value } : img))
    );
  };

  const saveMerchImage = async (img: MerchImage) => {
    await supabase.from("merch_images").update(img).eq("id", img.id);
    setMessage("Merch-Bild gespeichert.");
  };

  const addMerchImage = async () => {
    if (!selectedMerchId) return;

    const nextSort =
      selectedMerchImages.length > 0
        ? Math.max(...selectedMerchImages.map((i) => i.sort_order || 0)) + 1
        : 1;

    const { data } = await supabase
      .from("merch_images")
      .insert({
        merch_id: selectedMerchId,
        image_url: "",
        sort_order: nextSort,
      })
      .select()
      .single();

    if (data) {
      setMerchImages((prev) => [...prev, data as MerchImage]);
    }
  };

  const deleteMerchImage = async (id: number | string) => {
    await supabase.from("merch_images").delete().eq("id", id);
    setMerchImages((prev) => prev.filter((img) => img.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white flex">
      <aside className="w-[260px] border-r border-white/10 p-6">
        <h1 className="text-xl font-black uppercase tracking-[0.25em] mb-8">
          Admin
        </h1>

        <div className="space-y-3">
          <button onClick={() => setActiveTab("hero")} className={tabBtn(activeTab === "hero")}>
            Hero
          </button>

          <button onClick={() => setActiveTab("about")} className={tabBtn(activeTab === "about")}>
            About
          </button>

          <button
            onClick={() => setActiveTab("merchHeader")}
            className={tabBtn(activeTab === "merchHeader")}
          >
            Merch Header
          </button>

          <button onClick={() => setActiveTab("menu")} className={tabBtn(activeTab === "menu")}>
            Menu
          </button>

          <button onClick={() => setActiveTab("gallery")} className={tabBtn(activeTab === "gallery")}>
            Gallery
          </button>

          <button onClick={() => setActiveTab("merch")} className={tabBtn(activeTab === "merch")}>
            Merch
          </button>

          <button onClick={() => setActiveTab("footer")} className={tabBtn(activeTab === "footer")}>
            Footer
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-[980px]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black uppercase">
              {activeTab === "hero" && "Hero Settings"}
              {activeTab === "about" && "About Settings"}
              {activeTab === "merchHeader" && "Merch Header Settings"}
              {activeTab === "menu" && "Menu Settings"}
              {activeTab === "gallery" && "Gallery Settings"}
              {activeTab === "merch" && "Merch Settings"}
              {activeTab === "footer" && "Footer Settings"}
            </h2>

            {(activeTab === "hero" ||
              activeTab === "about" ||
              activeTab === "merchHeader" ||
              activeTab === "footer") && (
              <button
                onClick={saveSettings}
                disabled={savingSettings}
                className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:opacity-90 disabled:opacity-50"
              >
                {savingSettings ? "Saving..." : "Save"}
              </button>
            )}
            <button
  onClick={async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin-login";
  }}
  className="px-6 py-3 rounded-xl border border-white/15 text-white font-bold hover:bg-white/10"
>
  Logout
</button>
          </div>

          {message && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-white/10 border border-white/10">
              {message}
            </div>
          )}

          {uploading && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-white/10 border border-white/10">
              Uploading file...
            </div>
          )}

          {activeTab === "hero" && (
            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-sm text-white/70">Hero Mode</label>
                <select
                  name="hero_mode"
                  value={settings.hero_mode || "video"}
                  onChange={handleSettingsChange}
                  className={inputClass}
                >
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm text-white/70">Hero Title</label>
                <input
                  name="hero_title"
                  value={settings.hero_title || ""}
                  onChange={handleSettingsChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white/70">Hero Subtitle</label>
                <input
                  name="hero_subtitle"
                  value={settings.hero_subtitle || ""}
                  onChange={handleSettingsChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white/70">Hero Button Text</label>
                <input
                  name="hero_button_text"
                  value={settings.hero_button_text || ""}
                  onChange={handleSettingsChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white/70">Hero Image URL</label>
                <input
                  name="hero_image_url"
                  value={settings.hero_image_url || ""}
                  onChange={handleSettingsChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white/70">Upload Hero Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const url = await uploadFile(file);
                    if (url) {
                      setSettings((prev) => ({
                        ...prev,
                        hero_image_url: url,
                      }));
                    }
                  }}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white/70">Hero Video URL</label>
                <input
                  name="hero_video_url"
                  value={settings.hero_video_url || ""}
                  onChange={handleSettingsChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white/70">Upload Hero Video</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const url = await uploadFile(file);
                    if (url) {
                      setSettings((prev) => ({
                        ...prev,
                        hero_video_url: url,
                      }));
                    }
                  }}
                  className={inputClass}
                />
              </div>

              {settings.hero_video_url && (
                <div>
                  <label className="block mb-2 text-sm text-white/70">Video Preview</label>
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                    <video
                      src={settings.hero_video_url}
                      controls
                      muted
                      playsInline
                      className="w-full max-h-[340px] object-cover"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm text-white/70">Music URL</label>
                <input
                  name="music_url"
                  value={settings.music_url || ""}
                  onChange={handleSettingsChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white/70">Upload Music</label>
                <input
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a,.ogg"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setMessage("Uploading music...");
                    const url = await uploadFile(file);

                    if (!url) {
                      setMessage("Music upload failed.");
                      return;
                    }

                    setSettings((prev) => ({
                      ...prev,
                      music_url: url,
                    }));

                    setMessage("Music uploaded. Click Save.");
                  }}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-sm text-white/70">About Image URL</label>
                <input
                  name="about_image_url"
                  value={settings.about_image_url || ""}
                  onChange={handleSettingsChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white/70">Upload About Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const url = await uploadFile(file);
                    if (url) {
                      setSettings((prev) => ({
                        ...prev,
                        about_image_url: url,
                      }));
                    }
                  }}
                  className={inputClass}
                />
              </div>

              {settings.about_image_url && (
                <div>
                  <label className="block mb-2 text-sm text-white/70">Image Preview</label>
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                    <img
                      src={settings.about_image_url}
                      alt="About Preview"
                      className="w-full max-h-[340px] object-cover"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm text-white/70">About Title 1</label>
                <input
                  name="about_title_1"
                  value={settings.about_title_1 || ""}
                  onChange={handleSettingsChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white/70">About Title 2</label>
                <input
                  name="about_title_2"
                  value={settings.about_title_2 || ""}
                  onChange={handleSettingsChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white/70">About Title 3</label>
                <input
                  name="about_title_3"
                  value={settings.about_title_3 || ""}
                  onChange={handleSettingsChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white/70">About Description</label>
                <textarea
                  name="about_description"
                  value={settings.about_description || ""}
                  onChange={handleSettingsChange}
                  rows={6}
                  className={textareaClass}
                />
              </div>
            </div>
          )}

          {activeTab === "merchHeader" && (
            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-sm text-white/70">Merch Eyebrow</label>
                <input
                  name="merch_eyebrow"
                  value={settings.merch_eyebrow || ""}
                  onChange={handleSettingsChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white/70">Merch Title</label>
                <input
                  name="merch_title"
                  value={settings.merch_title || ""}
                  onChange={handleSettingsChange}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {activeTab === "footer" && (
            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-sm text-white/70">Address</label>
                <input
                  name="address"
                  value={settings.address || ""}
                  onChange={handleSettingsChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white/70">Phone</label>
                <input
                  name="phone"
                  value={settings.phone || ""}
                  onChange={handleSettingsChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white/70">Email</label>
                <input
                  name="email"
                  value={settings.email || ""}
                  onChange={handleSettingsChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white/70">Instagram</label>
                <input
                  name="instagram"
                  value={settings.instagram || ""}
                  onChange={handleSettingsChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white/70">Opening Hours</label>
                <textarea
                  name="opening_hours"
                  value={settings.opening_hours || ""}
                  onChange={handleSettingsChange}
                  rows={4}
                  className={textareaClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white/70">Map URL</label>
                <input
                  name="map_url"
                  value={settings.map_url || ""}
                  onChange={handleSettingsChange}
                  className={inputClass}
                />
              </div>
            </div>
          )}
          {activeTab === "menu" && (
            <div className="space-y-6">
              <button
                onClick={addMenuItem}
                className="px-4 py-2 bg-white text-black rounded-lg font-bold"
              >
                + Add Item
              </button>

              <div className="space-y-4">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
                  >
                    <input
                      value={item.name || ""}
                      onChange={(e) =>
                        updateMenuField(item.id, "name", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Name"
                    />

                    <textarea
                      value={item.description || ""}
                      onChange={(e) =>
                        updateMenuField(item.id, "description", e.target.value)
                      }
                      rows={3}
                      className={textareaClass}
                      placeholder="Description"
                    />

                    <input
                      value={item.price || ""}
                      onChange={(e) =>
                        updateMenuField(item.id, "price", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Price"
                    />

                    <input
                      value={item.category || ""}
                      onChange={(e) =>
                        updateMenuField(item.id, "category", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Category"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => saveMenuItem(item)}
                        className={`${smallBtn} bg-green-500`}
                      >
                        Save
                      </button>

                      <button
                        onClick={() => deleteMenuItem(item.id)}
                        className={`${smallBtn} bg-red-500`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="space-y-6">
              <button
                onClick={addGalleryItem}
                className="px-4 py-2 bg-white text-black rounded-lg font-bold"
              >
                + Add Image
              </button>

              <div>
                <label className="block mb-2 text-sm text-white/70">
                  Upload Gallery Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setMessage("Uploading gallery image...");

                    const url = await uploadFile(file);

                    if (!url) {
                      setMessage("Upload to Storage failed.");
                      return;
                    }

                    const { data, error } = await supabase
                      .from("gallery")
                      .insert({
                        image_url: url,
                        description: "",
                      })
                      .select()
                      .single();

                    if (error) {
                      console.error("Gallery insert error:", error);
                      setMessage("Insert into gallery table failed.");
                      return;
                    }

                    if (data) {
                      setGalleryItems((prev) => [...prev, data]);
                      setMessage("Gallery image added successfully.");
                    }
                  }}
                  className={inputClass}
                />
              </div>

              <div className="space-y-4">
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
                  >
                    <input
                      value={item.image_url || ""}
                      onChange={(e) =>
                        updateGalleryField(item.id, "image_url", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Image URL"
                    />

                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt=""
                        className="w-full max-h-[260px] object-cover rounded-xl border border-white/10"
                      />
                    )}

                    <textarea
                      value={item.description || ""}
                      onChange={(e) =>
                        updateGalleryField(item.id, "description", e.target.value)
                      }
                      rows={3}
                      className={textareaClass}
                      placeholder="Description"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => saveGalleryItem(item)}
                        className={`${smallBtn} bg-green-500`}
                      >
                        Save
                      </button>

                      <button
                        onClick={() => deleteGalleryItem(item.id)}
                        className={`${smallBtn} bg-red-500`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "merch" && (
            <div className="space-y-6">
              <div className="flex gap-3">
                <button
                  onClick={addMerchItem}
                  className="px-4 py-2 bg-white text-black rounded-lg font-bold"
                >
                  + Add Product
                </button>

                <select
                  value={String(selectedMerchId || "")}
                  onChange={(e) => setSelectedMerchId(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10"
                >
                  {merchItems.map((item) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {merchItems
                .filter((item) => item.id === selectedMerchId)
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
                  >
                    <input
                      value={item.name || ""}
                      onChange={(e) =>
                        updateMerchField(item.id, "name", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Name"
                    />

                    <input
                      value={item.subtitle || ""}
                      onChange={(e) =>
                        updateMerchField(item.id, "subtitle", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Subtitle"
                    />

                    <input
                      value={item.price || ""}
                      onChange={(e) =>
                        updateMerchField(item.id, "price", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Price"
                    />

                    <input
                      value={item.label || ""}
                      onChange={(e) =>
                        updateMerchField(item.id, "label", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Label"
                    />

                    <input
                      value={item.image_url || ""}
                      onChange={(e) =>
                        updateMerchField(item.id, "image_url", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Main Image URL"
                    />

                    <div>
                      <label className="block mb-2 text-sm text-white/70">
                        Upload Main Product Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file || !selectedMerchId) return;

                          const url = await uploadFile(file);
                          if (url) {
                            setMerchItems((prev) =>
                              prev.map((merchItem) =>
                                merchItem.id === selectedMerchId
                                  ? { ...merchItem, image_url: url }
                                  : merchItem
                              )
                            );
                          }
                        }}
                        className={inputClass}
                      />
                    </div>

                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt=""
                        className="w-full max-h-[260px] object-cover rounded-xl border border-white/10"
                      />
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => saveMerchItem(item)}
                        className={`${smallBtn} bg-green-500`}
                      >
                        Save Product
                      </button>

                      <button
                        onClick={() => deleteMerchItem(item.id)}
                        className={`${smallBtn} bg-red-500`}
                      >
                        Delete Product
                      </button>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Extra Images</h3>

                        <button
                          onClick={addMerchImage}
                          className="px-4 py-2 bg-white text-black rounded-lg font-bold"
                        >
                          + Add Image
                        </button>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm text-white/70">
                          Upload Extra Merch Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file || !selectedMerchId) return;

                            const url = await uploadFile(file);
                            if (!url) return;

                            const nextSort =
                              selectedMerchImages.length > 0
                                ? Math.max(
                                    ...selectedMerchImages.map((i) => i.sort_order || 0)
                                  ) + 1
                                : 1;

                            const { data } = await supabase
                              .from("merch_images")
                              .insert({
                                merch_id: selectedMerchId,
                                image_url: url,
                                sort_order: nextSort,
                              })
                              .select()
                              .single();

                            if (data) {
                              setMerchImages((prev) => [...prev, data]);
                            }
                          }}
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-4 mt-4">
                        {selectedMerchImages.map((img) => (
                          <div
                            key={img.id}
                            className="p-4 rounded-xl bg-black/20 border border-white/10 space-y-3"
                          >
                            <input
                              value={img.image_url || ""}
                              onChange={(e) =>
                                updateMerchImageField(img.id, "image_url", e.target.value)
                              }
                              className={inputClass}
                              placeholder="Image URL"
                            />

                            <input
                              value={String(img.sort_order || 0)}
                              onChange={(e) =>
                                updateMerchImageField(
                                  img.id,
                                  "sort_order",
                                  Number(e.target.value)
                                )
                              }
                              className={inputClass}
                              placeholder="Sort Order"
                            />

                            {img.image_url && (
                              <img
                                src={img.image_url}
                                alt=""
                                className="w-full max-h-[220px] object-cover rounded-xl border border-white/10"
                              />
                            )}

                            <div className="flex gap-2">
                              <button
                                onClick={() => saveMerchImage(img)}
                                className={`${smallBtn} bg-green-500`}
                              >
                                Save Image
                              </button>

                              <button
                                onClick={() => deleteMerchImage(img.id)}
                                className={`${smallBtn} bg-red-500`}
                              >
                                Delete Image
                              </button>
                            </div>
                          </div>
                        ))}

                        {selectedMerchImages.length === 0 && (
                          <div className="text-white/50 text-sm">
                            No extra images yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;       