import type { MetaFunction } from 'remix';

export const meta: MetaFunction = () => {
  return { title: 'たからーん年賀状AR 2022' };
};

const Ar = () => {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      これは年賀状のサイトです！
    </div>
  );
}

export default Ar;
