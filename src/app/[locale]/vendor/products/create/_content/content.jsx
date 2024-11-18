"use client";
import { useState, useEffect } from "react";
import { Link } from "react-scroll";
import styles from "./content.module.css";
import BasicInformation from "./basicInformation";
import DetailInformation from "./detailInformation";
import { getAll } from "@/api/admin/categoryRequest";
import { getComponentOfCategory } from "@/api/admin/componentRequest";

export default function Content() {
  const [activeSection, setActiveSection] = useState("about");
  const [listCategory, setListCategory] = useState([]);
  const [categoryIdSelected, setCategoryIdSelected] = useState(null);
  const [listComponents, setListComponent] = useState([]);

  useEffect(() => {
    setActiveSection("about");

    getAll().then((response) => {
      setListCategory(response.result);
    });
  }, []);

  useEffect(() => {
    if (categoryIdSelected) {
      getComponentOfCategory(categoryIdSelected).then((response) => {
        setListComponent(response.result);
      });
    }
  }, [categoryIdSelected]);

  return (
    <div>
      <header className="sticky top-16 z-10 h-10 shadow bg-white-primary">
        <nav className="w-full h-full flex">
          <ul className="space-x-4 flex flex-row justify-center items-center px-5 text-[14px]">
            <li>
              <Link
                activeClass={styles.active}
                smooth
                spy
                to="about"
                onSetActive={() => setActiveSection("about")}
                className={`cursor-pointer ${
                  activeSection === "about" ? styles.active : ""
                }`}
              >
                Thông Tin Cơ Bản
              </Link>
            </li>
            <li>
              <Link
                activeClass={styles.active}
                smooth
                spy
                to="projects"
                onSetActive={() => setActiveSection("projects")}
                className={`cursor-pointer ${
                  activeSection === "projects" ? styles.active : ""
                }`}
              >
                Thông Tin Chi Tiết
              </Link>
            </li>
            <li>
              <Link
                activeClass={styles.active}
                smooth
                spy
                to="blog"
                onSetActive={() => setActiveSection("blog")}
                className={`cursor-pointer ${
                  activeSection === "blog" ? styles.active : ""
                }`}
              >
                Thông Tin Bán Hàng
              </Link>
            </li>
            <li>
              <Link
                activeClass={styles.active}
                smooth
                spy
                to="contact"
                onSetActive={() => setActiveSection("contact")}
                className={`cursor-pointer ${
                  activeSection === "contact" ? styles.active : ""
                }`}
              >
                Thông Tin Khác
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <section
        id="about"
        className="h-fit min-h-screen flex flex-col items-start justify-center bg-gray-200 mt-16"
      >
        <span className="px-5 py-3 font-[900]">
          Thông tin cơ bản của sản phẩm
        </span>
        <BasicInformation
          listCategory={listCategory}
          setCategoryIdSelected={setCategoryIdSelected}
        />
      </section>
      <div className="w-[97%] h-[1px] mt-5 mx-auto bg-white-secondary"></div>
      <section
        id="projects"
        className="h-fit min-h-screen flex flex-col items-start justify-start bg-gray-200"
      >
        <span className="px-5 py-3 font-[900]">
          Thông tin chi tiết của sản phẩm
          <p className="flex flex-row items-center">
            <span className="text-error-dark mr-3 text-xl">*</span>
            <span className="italic text-sm">
              Các thông tin về thông số kỹ thuật nên nhập cùng đơn vị.
            </span>
          </p>
          <p className="flex flex-row items-center">
            <span className="text-error-dark mr-3 text-xl">*</span>
            <span className="italic text-sm">
              Đối với các thông số kỹ thuật có nhiều giá trị, sử dụng ký tự "\"
              ngăn cách giữa các giá trị.
            </span>
          </p>
        </span>
        <DetailInformation listComponents={listComponents} />
      </section>
      <section
        id="blog"
        className="h-screen flex items-center justify-center bg-gray-400"
      >
        BLOG
      </section>
      <section
        id="contact"
        className="h-screen flex items-center justify-center bg-gray-500"
      >
        CONTACT ME
      </section>
    </div>
  );
}
